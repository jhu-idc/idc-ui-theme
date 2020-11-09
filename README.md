## TODO:

- When we're happy with a change, or set of changes, in the theme, how do we get them incorporated that as a "default" in `idc-isle-dc`?
- How do we go about defining and using a new custom JS-based component?
  - Use of Glimmer
  - Tell Drupal about your new component so it can be imported automatically
  - How to handle dependencies for different components? Yarn workspaces?
- How can we test templates?

## Prerequisites for development

- NodeJS
- [Yarn](https://classic.yarnpkg.com/en/)
- Docker
- make

We are using Glimmer (https://glimmerjs.com/) to create custom Javascript components that we can place into Twig templates. Large amounts of required functionality will be implemented in these components. We also rely on a separate Github repository to setup a development environment.

- `idc-isle-dc` (https://github.com/jhu-sheridan-libraries/idc-isle-dc)

## Using the development environment

- Describe how to setup this repo with the `idc-isle-dc` environment for Drupal theme development
  - Define a `docker-compose.override.yml` to use in the dev environment that will bind mount this repo
  - Enable debugging in Drupal
  - Access the Drupal container to get Drush to clear Drupal's caches

During development, we utilize the environment setup by the `idc-isle-dc` repository. You'll need to make some manual changes to the development environment to allow for realtime changes in this repository to appear in the Drupal instance.

Use a bind mount to map your local theme repository. This can be defined by adding a `docker-compose.override.yml` file to the development environment. The following example (once the placeholder directory is filled in) will add a new volume to the Drupal container. As long as you point to the location of this repository on your local machine, your local code will be brought into the Drupal themes directory and appear in Drupal's admin interface.

_docker-compose.override.yml_

```yml
version: "3.7"
services:
  drupal:
    volumes:
      - <dir_of_this_repo>:/var/www/drupal/themes/idc-ui
```

Note: you'll need to update this text and replace your current working directory of this repository in place of `<dir_of_this_repo>`.

We'll also want to enable template debugging in Drupal to aid development. To do this, you can manually change Drupal's `services.yml` file in `codebase/web/sites/default/`. In this file, you can change `twig.config.debug` to `true`. Twig debugging statements will appear in pages once you clear Drupal's cache. **Note: this change should not make it into any production-ready snapshots**

### Handling the theme in Drupal

Once you can see the theme in Drupal, you can install and set as the default theme to see your local theme. In order to see changes you make to the theme, you'll still have to clear Drupal's cache. You can do this in the normal Drupal admin interface, or I'd recommend using Drush in the Drupal docker container.

You can use `docker-compose exec` to run commands in the Drupal container. To easily clear Drupal's cache, for example, you can run the following command:

```shell
docker-compose exec drupal drush cr
```

## JS development

JS root: `js/`

Some common commands:

- `yarn build` : build all packages
- `yarn watch` : run a "watch" process for each package to automatically recompile packages when files are changed
- `yarn test` : TODO - run tests in all packages

We run ESLint pre-git-commit so that any changes must pass ESLint before it can be committed. It is recommended that you setup your editor to run "prettier" automatically. In VSCode, you can use the [Prettier plugin](https://marketplace.visualstudio.com/items?itemName=esbenp.prettier-vscode) and follow the instructions provided to enable this feature.

### Workspaces

We are using Lerna in concert with Yarn workspaces to manage dependencies across multiple directories. These tools are normally used to manage monorepos - single git repositories that contain multiple packages. They have the ability to share dependencies across packages for faster installs. They can also link packages together so some packages can depend on and use another independent package. Lerna can run multiple webpack instances in parellel which allows files across the monorepo's packages to be watched simultaneously, but configured as separate instances of webpack. To watch in parellel run: `npx lerna run --parallel watch`.

## Other Resources

- [Lerna](https://github.com/lerna/lerna)
