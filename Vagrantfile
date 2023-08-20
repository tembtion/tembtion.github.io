# -*- mode: ruby -*-
# vi: set ft=ruby :

Vagrant.configure("2") do |config|
  config.vm.box = "bento/ubuntu-18.04"
  config.vm.network "forwarded_port", guest: 4000, host: 4000 # http port
  config.vm.network "forwarded_port", guest: 35729, host: 35729 # for liveserve.js
  config.vm.hostname = "jekyll.blog"

  config.vm.provider "virtualbox" do |vb|
    vb.name = "blog - jekyll"
    vb.memory = "512"
    vb.cpus = 1
  end

  config.vm.provision "shell", inline: <<-SHELL
    echo "*** apt-get update"
    apt-get update

#    echo "*** apt-get upgrade"
#    apt-get upgrade -y

    echo "*** Installing build-essential"
    apt-get install -y build-essential

    echo "*** Installing ruby"
    apt-get install -y ruby

    echo "*** Installing ruby-dev"
    apt-get install -y ruby-dev

    echo "*** Installing jekyll"
    gem install jekyll

    echo "*** Installing bundler"
    gem install bundler

    echo "*** Installing tmux"
    apt-get install -y tmux

    echo "*** Installing fish (shell)"
    apt-get install -y fish

  SHELL
end

