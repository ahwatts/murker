#!/usr/bin/env ruby

require "json"
require "sinatra"
require "sinatra/cross_origin"

def base_dir(args)
  bd = args.shift || "/"
  if bd !~ /^\//
    bd = File.expand_path(bd)
  end
  bd
end

def load_index(base)
  song_files = []
  index_file = File.expand_path("index", File.dirname(__FILE__))

  begin
    File.open(index_file, "rb") do |f|
      puts "loading index from #{index_file}"
      song_files = JSON.load(f.read)
    end
    puts "loaded index of #{song_files.size} songs"
  rescue
    puts "indexing #{base}/**/*.mp3"
    song_files = Dir.glob("#{base}/**/*.mp3").map.with_index do |file, i|
      {
        "entry" => {
          "id" => i,
          "name" => File.basename(file, ".mp3").gsub(/[^a-zA-Z0-9]/, " ").squeeze(" ").strip,
          "url" => "http://localhost:4567/song/#{i}/stream.mp3",
        },
        "file" => file,
      }
    end
    puts "indexed #{song_files.size} songs"

    File.open(index_file, "wb") do |f|
      puts "saving index to #{index_file}"
      f.write(JSON.dump(song_files))
    end
  end

  song_files
end

BASE_DIR = base_dir(ARGV).freeze
SONG_FILES = load_index(BASE_DIR).freeze
register Sinatra::CrossOrigin

configure do
  mime_type :mp3, "audio/mpeg"
  enable :cross_origin
end

get "/" do
  "Hello, World!\n"
end

get "/api/song/search/:name" do |name|
  cross_origin
  content_type :json
  found_files = SONG_FILES.select do |s|
    s["entry"]["name"] =~ /#{Regexp.escape(name)}/i
  end
  entries = found_files.map { |s| s["entry"] }
  { results: entries }.to_json
end

get "/song/:id/stream.mp3" do |id|
  content_type :mp3
  File.read(SONG_FILES[id.to_i]["file"])
end
