FROM romeoz/docker-apache-php:7.3

RUN apt-get update && apt-get install less unzip

RUN curl https://wordpress.org/latest.zip -o wordpress.zip
RUN unzip wordpress.zip
RUN mv wordpress/* .
RUN rm -rf wordpress.zip wp-config-sample.php wp-content
RUN curl https://raw.githubusercontent.com/wp-cli/builds/gh-pages/phar/wp-cli.phar -o /usr/local/bin/wp
RUN chmod +x /usr/local/bin/wp

RUN curl -sS https://getcomposer.org/installer | php -- --install-dir=/usr/local/bin --filename=composer
COPY composer.json .
COPY composer.lock .
RUN composer install

COPY site-config.conf /etc/apache2/sites-enabled/000-default.conf
COPY ports.conf /etc/apache2/ports.conf

COPY wp-config.php .
COPY htaccess-template .htaccess
COPY migrations app/migrations
COPY wp-content wp-content

COPY setup.sh .

EXPOSE 8080
CMD ["./setup.sh"]
