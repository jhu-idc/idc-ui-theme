FROM node:14.17.1 as build
ARG BUILD_CONTEXT

# Run to build the theme
# docker build -t idc_theme_build .
# docker run --rm -v $(pwd):/usr/src/project idc_theme_build bash -c "cd js && bash autobuild.sh"

RUN mkdir -p /usr/src/project
WORKDIR /usr/src/project
