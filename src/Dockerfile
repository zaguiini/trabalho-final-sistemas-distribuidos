FROM wyveo/nginx-php-fpm:php73

COPY 99-overrides.conf /etc/php/7.3/fpm/pool.d

WORKDIR /usr/share/nginx/html

RUN apt-get update && apt-get -y install curl unzip

RUN curl https://wordpress.org/latest.zip -o wordpress.zip
RUN unzip wordpress.zip
RUN mv wordpress/* .
RUN rm -rf wordpress.zip wp-config-sample.php wp-content

RUN curl https://raw.githubusercontent.com/wp-cli/builds/gh-pages/phar/wp-cli.phar -o /usr/local/bin/wp
RUN chmod +x /usr/local/bin/wp

COPY wp-config.php .
COPY wp-content wp-content
COPY migrations app/migrations

RUN curl -sS https://getcomposer.org/installer | php -- --install-dir=/usr/local/bin --filename=composer
COPY composer.json .
COPY composer.lock .
RUN composer install

COPY setup.sh .

EXPOSE 80
CMD ["./setup.sh"]
