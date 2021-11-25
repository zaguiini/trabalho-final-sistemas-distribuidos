<?php

use DeliciousBrains\WPMigrations\Database\AbstractMigration;

class ActivateS3Uploads extends AbstractMigration {
    private $plugin = 's3-uploads/s3-uploads.php';

    public function run() {
      if( ! is_plugin_active( $this->plugin ) ) {
          activate_plugin( $this->plugin );
      }
    }

    public function rollback() {
      if( is_plugin_active( $this->plugin ) ) {
        deactivate_plugins( [ $this->plugin ] );
      }
    }
}
