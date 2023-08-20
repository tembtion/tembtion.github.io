require 'rake'
require 'date'
require 'yaml'

CONFIG = YAML.load(File.read('_deploy.yml'))
USERNAME = CONFIG["username"]
REMOTE_LOCATION = CONFIG["remote_location"]
REMOTE_PORT = CONFIG["remote_port"]
GENERATED = '_site'

namespace :site do
  desc "Generate the site"
  task :build do
    sh "bundle exec jekyll build"
  end

  desc "Generate the site and serve locally"
  task :serve do
    sh "bundle exec jekyll serve --incremental --host 0.0.0.0"
  end

  desc "Generate the site and serve locally, refreshing browser on changes"
  task :liveserve do
    sh "bundle exec jekyll liveserve --incremental --host 0.0.0.0"
  end

  desc "Generate the site, serve locally and watch for changes"
  task :watch do
    sh "bundle exec jekyll serve --watch --host 0.0.0.0"
  end

  task :install_gem do
    sh "sudo gem install _gems/jasper2-2.1.9.gem"
  end

  desc "Generate the site and push changes to remote origin"
  task :deploy do
    # Generate the site
    sh "bundle exec jekyll build"
    sh "rsync -e \"ssh -l #{USERNAME} -p #{REMOTE_PORT}\" -ravz --delete --prune-empty-dirs --checksum -h #{GENERATED} #{REMOTE_LOCATION}"
  end
end
