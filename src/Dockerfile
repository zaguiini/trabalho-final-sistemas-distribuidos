FROM wyveo/nginx-php-fpm:php73

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

COPY setup.sh .

EXPOSE 80
CMD ["./setup.sh"]
