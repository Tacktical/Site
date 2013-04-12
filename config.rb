require 'dotenv'
Dotenv.load

#require 'susy'

set :css_dir,    'stylesheets'
set :js_dir,     'javascripts'
set :images_dir, 'images'

activate :sprockets

configure :build do
  activate :minify_css
  activate :minify_javascript
  activate :cache_buster
  activate :smusher #compressed PNG files

  if ENV['DEPLOY']
    activate :s3_deploy do |s3|
      s3.access_key_id     = ENV['S3_KEY']
      s3.secret_access_key = ENV['S3_SECRET']
      s3.bucket            = ENV['S3_BUCKET']
    end
  end
end
