name: homecheck-server
region: fra
services:
- environment_slug: node-js
  github:
    branch: main
    deploy_on_push: true
    repo: zakzag/HomeCheckServer
  http_port: 8100
  instance_count: 1
  instance_size_slug: basic-xxs
  name: homecheckserver
  routes:
  - path: /
  run_command: npm start
  source_dir: /