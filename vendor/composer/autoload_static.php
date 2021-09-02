<?php

// autoload_static.php @generated by Composer

namespace Composer\Autoload;

class ComposerStaticInitb9893979d644f5742da1a6feecd9d94b
{
    public static $prefixesPsr0 = array (
        'C' => 
        array (
            'ConvertApi\\' => 
            array (
                0 => __DIR__ . '/..' . '/convertapi/convertapi-php/lib',
            ),
        ),
    );

    public static $classMap = array (
        'Composer\\InstalledVersions' => __DIR__ . '/..' . '/composer/InstalledVersions.php',
    );

    public static function getInitializer(ClassLoader $loader)
    {
        return \Closure::bind(function () use ($loader) {
            $loader->prefixesPsr0 = ComposerStaticInitb9893979d644f5742da1a6feecd9d94b::$prefixesPsr0;
            $loader->classMap = ComposerStaticInitb9893979d644f5742da1a6feecd9d94b::$classMap;

        }, null, ClassLoader::class);
    }
}
