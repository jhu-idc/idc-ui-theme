## TODO:

- When we're happy with a change, or set of changes, in the theme, how do we get them incorporated that as a "default" in `idc-isle-dc`?
- How do we go about defining and using a new custom JS-based component?
  - Tell Drupal about your new component so it can be imported automatically

# Prerequisites for development

- NodeJS - We have developed with `lts/erbium (v12.22.5)` and `lts/fermium (v14.17.5)` successfully, other versions may work, but we haven't tested them.
- [Yarn](https://classic.yarnpkg.com/en/)
- Docker
- make

We are using Glimmer (https://glimmerjs.com/) to create custom Javascript components that we can place into Twig templates. Large amounts of required functionality will be implemented in these components. We also rely on a separate Github repository to setup a development environment.

- `idc-isle-dc` (https://github.com/jhu-sheridan-libraries/idc-isle-dc)

# Using the development environment

During development, we utilize the environment setup by the `idc-isle-dc` repository to stand up a local instance of the application stack for development. When the Drupal image in this stack is brought up, it will automatically download this repository from Github as a local git repository, allowing you to develop from within the running Drupal file structure.

**In Linux or WSL(2) in Windows, we've found that you'll likely need to update file permissions, or take ownership of all files in the Drupal file hierarchy, as they are owned by `root` by default.** Using `chmod` may not play nice with git, so you may use `chown` to take ownership of the files.

## Starting the dev environment

```shell
make up
  # OR
make reset
```

In `idc-isle-dc`, run `make up` if starting from a freshly cloned repository, otherwise `make reset` will bring down any docker containers if necessary, clean out dependencies and the database, then bring the stack back up. During startup, Composer will download

After you run one of these commands

## Twig debugging

You may also want to enable template debugging in Drupal to aid development. To do this, you can copy Drupal's `default.services.yml` file in `codebase/web/sites/default/` as `services.yml`. In this file, you can change `twig.config.debug` to `true`.

## Handling the theme in Drupal

Once you can see the theme in Drupal, you can install and set as the default theme to see your local theme. In order to see changes you make to the theme, you'll still have to clear Drupal's cache. You can do this in the normal Drupal admin interface, using Drush in the Drupal docker container, or using the convenience `make` target.

```shell
make cache-rebuild
```

# JS development

We have been developing this theme from within `idc-isle-dc`. Composer is configured to pull the theme's source git repository, so you're able to open your editor or IDE in `idc-isle-dc/codebase/web/themes/contrib/idc-ui-theme/` and develop from there. This way, you'll be able to see changes made to the theme in near real time in a local instance of Drupal.

JS root: `js/`

Some common commands:

- `yarn build` : build all packages
- `yarn watch` : run a "watch" process for each package to automatically recompile packages when files are changed

During development, you can run `yarn watch` to see your changes almost in real time. The JS code will recompile, but you may have to clear Drupal cache to see the changes in the browser.

## Workspaces

https://classic.yarnpkg.com/en/docs/cli/workspace

We are using Lerna in concert with Yarn workspaces to manage dependencies across multiple directories. These tools are normally used to manage monorepos - single git repositories that contain multiple packages. They have the ability to share dependencies across packages for faster installs. They can also link packages together so some packages can depend on and use another independent package. Lerna can run multiple webpack instances in parallel which allows files across the monorepo's packages to be watched simultaneously, but configured as separate instances of webpack. To watch in parallel run: `npx lerna run --parallel watch`.

## Handling dependencies

You can technically run `yarn add` in individual JS packages to add dependencies, but this is not recommended. If you want to use Yarn to manage dependencies, it is better if you use

```shell
yarn workspace <package_name> <command>
```
Where the names of the directories under `js/packages/` are the names of your packages. For example, if you wanted to add a dependency to just the _glimmer-idc_ package, you'd run `yarn workspace glimmer-idc add <dependency_name>`.

## Handling build artifacts

Currently, we manually update build artifacts in each JS package `dist/` directory. At the time, this was the simplest way we could have Composer pull in the theme with pre-built artifacts, required for the running instance. In the future, this should be changed to publishing proper production-ready build artifacts and having Composer download those artifacts, instead of the Github repository.

By convention, we run `yarn build` and commit the artifacts in `dist/` folders for each JS package in git before issuing any pull requests.

## Pushing changes to `idc-isle-dc`

Once you're happy with changes made to the theme and have the artifacts built and committed, switch back to `idc-isle-dc` in order to incorporate the changes into the codebase. For the sake of consistency, it's recommended that you run Composer from within the Drupal container. Doing so removes the necessity of having Composer installed locally as well as possible issues between different composer versions.

In the Drupal container, update the theme by running (you'll be asked for your Github PAT for authorization):

```shell
composer update jhu-idc/idc-ui-theme
```

Because of how the Drupal container mounts the codebase, the `composer.lock` fill in your local file system will be updated. This should be committed to incorporate the new changes in the theme.

# Tests

Most of our tests take place as integration/acceptance tests running against the local Drupal stack. You can find these at `idc-isle-dc/end-to-end/tests/ui/`.

Run these tests by calling `make test test=01-end-to-end`

When the tests run, they will run data migrations to pull in all of the data from `idc-isle-dc/end-to-end/testdata` into the currently running Drupal. It does not do this smartly, so specifically the "admin" tests will create new objects each time the tests are run, potentially causing some tests to fail down the line. Recommend that all data in Drupal is reset and removed prior to running this test suite with `make reset`. _CI is setup to run `make reset` between each test suite, ensuring no test data pollution_

# Other Resources

- [Lerna](https://github.com/lerna/lerna)
