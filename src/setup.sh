#!/bin/bash
source /etc/apache2/envvars
a2enmod rewrite
service apache2 start
wp core install --url=$WORDPRESS_URL --title=$WORDPRESS_TITLE --admin_user=$WORDPRESS_ADMIN_USER --admin_password=$WORDPRESS_ADMIN_PASSWORD --admin_email=$WORDPRESS_ADMIN_EMAIL --allow-root
wp dbi migrate --setup --allow-root
wp dbi migrate --allow-root
service apache2 stop
exec apache2 -D FOREGROUND
