
## TODO:
* When we're happy with a change, or set of changes, in the theme, how do we get them incorporated that as a "default" in `idc-isle-dc`?
* How do we go about defining and using a new custom JS-based component?
  * Use of Glimmer
  * Tell Drupal about your new component so it can be imported automatically
  * How to handle dependencies for different components? Yarn workspaces?
* How do we handle CSS? We plan on using Tailwind, but I don't have much experience with it. Will we have a shared CSS file with our utility classes to import in the Glimmer components?
* How can we test templates?

## Prerequisites for development

* NodeJS
* Yarn
* Docker
* make

We are using Glimmer (https://glimmerjs.com/) to create custom Javascript components that we can place into Twig templates. Large amounts of required functionality will be implemented in these components. We also rely on a separate Github repository to setup a development environment.

* `idc-isle-dc` (https://github.com/jhu-sheridan-libraries/idc-isle-dc)

**Open question:** How are we going to manage theme-wide dependencies, such as Tailwind? Should we have a to level `package.json` and a script that `yarn` can execute to place the dependency in the correct folder for Drupal to deal with?

## Using the development environment

* Describe how to setup this repo with the `idc-isle-dc` environment for Drupal theme development
  * Define a `docker-compose.override.yml` to use in the dev environment that will bind mount this repo
  * Enable debugging in Drupal
  * Access the Drupal container to get Drush to clear Drupal's caches

During development, we utilize the environment setup by the `idc-isle-dc` repository. You'll need to make some manual changes to the development environment to allow for realtime changes in this repository to appear in the Drupal instance.

Use a bind mount to map your local theme repository. This can be defined by adding a `docker-compose.override.yml` file to the development environment. The following example (once the placeholder directory is filled in) will add a new volume to the Drupal container. As long as you point to the location of this repository on your local machine, your local code will be brought into the Drupal themes directory and appear in Drupal's admin interface.

_docker-compose.override.yml_
``` yml
version: '3.7'
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

``` shell
docker-compose exec drupal drush cr
```

## Yarn Workspaces 

We are using Yarn workspaces to manage dependencies for multiple custom components. In the root directory of this repository we have a `package.json` file that points to sub-folders in the `js/` directory and marks them as "workspaces." By doing this, we can run `yarn install` at our root directory to install all dependencies in all JS components while also reducing redundant downloads for any dependencies the JS components may share.

We can also take advantage of the root package definition to define global dependencies for our Drupal theme, such as Tailwind CSS, and automate it in a way to move it into the correct place for Drupal to automatically recognize. However, Yarn does not like having any dependency management in the root package. To get around this, you'll have to use the `-W`  flag: `yarn add -W <my_dependency>`


#### TODO: automating root-level dependencies

We should provide a script that will move a production ready asset to the right place for Drupal to recognize. For example, we could move the Tailwind CSS stylesheet(s) into the `css/` directory of our theme. Perhaps use a `postinstall` hook or something? This _could_ be complicated by workspaces, as we would only want to treat dependencies in the root-level `package.json`
