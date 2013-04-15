require "sprockets"

module Middleman::Sprockets
  class << self
    alias registered __registered
    def registered(app)
      __registered app

      app.after_configuration do
        try_paths = [File.join(%W{app assets images })]

        ([root] + ::Middleman.rubygems_latest_specs.map(&:full_gem_path)).each do |root_path|
          try_paths.map {|p| 
            File.join(root_path, p) }.
            select {|p| File.directory?(p) }.
            each {|path| sprockets.append_path(path) }
        end

        our_sprockets = sprockets
        map("/#{images_dir}") { run our_sprockets }
      end
    end
  end

  class MiddlemanSprocketsEnvironment < ::Sprockets::Environment
    alias initialize init
    def initialize(app)
      init app
      append_path app.images_dir
    end
  end
end
