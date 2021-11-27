FROM romeoz/docker-apache-php:7.3

RUN apt-get update && apt-get install less unzip

RUN curl https://wordpress.org/latest.zip -o wordpress.zip
RUN unzip wordpress.zip
RUN mv wordpress/* .
RUN rm -rf wordpress.zip wp-config-sample.php wp-content

COPY site-config.conf /etc/apache2/sites-enabled/000-default.conf
COPY ports.conf /etc/apache2/ports.conf

COPY wp-config.php .
COPY htaccess-template .htaccess
COPY wp-content wp-content

COPY setup.sh .

EXPOSE 8080
CMD ["./setup.sh"]
