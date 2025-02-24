const mix = require('laravel-mix');

mix.js('resources/js/app.js', 'public/js')
   .postCss('resources/css/app.css', 'public/css', [
        require('tailwindcss'),
        require('autoprefixer'),
   ])
   .copy('node_modules/@fortawesome/fontawesome-free/webfonts', 'public/webfonts'); 