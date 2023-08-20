---
layout: post
current: post
cover: /assets/images/posts/2023-06-11-phpcsfixer3/cover.png
navigation: True
title: PHP-CS-Fixer 3.0 安装及使用
date: 2023-06-11 09:00:00
tags: [getting-started]
class: post-template
subclass: 'post'
---

PHP-CS-Fixer是一个用于自动修复和标准化PHP代码风格的工具。它可以帮助开发人员保持一致的代码风格，减少代码审查时的冲突，并提高团队协作效率。
PhpCsFixer支持广泛的PHP代码风格规则和规范，包括缩进、括号风格、空格、换行符等等。通过配置文件，您可以定制需要应用的规则，并将其集成到项目的开发流程中。

### composer安装
```bash
composer global require friendsofphp/php-cs-fixer
```
### 查找安装目录
```bash
which php-cs-fixer
```
### 配置环境变量

### 查看环境变量是否配置成功
```bash
php-cs-fixer -v
```

### 执行命令
> 参数  
> /path/to/your/project/ 项目目录或文件  
> --using-cache no 不使用缓存  
> --config 配置文件路径

```php
php-cs-fixer fix /path/to/your/project/ --using-cache no --config=C:\Users\用户\AppData\Roaming\Composer\vendor\bin\php-cs-fixer.dist.php
```

### 配置文件

```php
<?php

$header = <<<'EOF'

EOF;

$finder = PhpCsFixer\Finder::create()
    ->ignoreDotFiles(false)
    ->ignoreVCSIgnored(true)
    ->name('*.php')
    ->exclude(['vendor']) // 目录排除
    ->in(__DIR__);

$config = new PhpCsFixer\Config();
$config->setRiskyAllowed(true)
    ->setRules([
        // 规则类型
        '@PhpCsFixer'                            => true,
        'phpdoc_to_comment'                      => false,
        // 等号参数 (1 == $c) => ($c == 1)
        'yoda_style'                             => false,
        // 增量样式 ($a++) => (++$a)
        'increment_style'                        => false,
        // 连接空格 ('baz'.'qux') => ('baz' . 'qux')
        'concat_space'                           => ['spacing' => 'one'],
        // 分号换行
        'multiline_whitespace_before_semicolons' => ['strategy' => 'no_multi_line'],
        // 头部注释
        'header_comment'                         => ['header' => $header],
        // 对齐
        'binary_operator_spaces'                 => [
            'operators' => [
                '='  => 'align_single_space_minimal',
                '=>' => 'align_single_space_minimal',
            ],
        ],
    ])
    ->setFinder($finder);

return $config;
```

### 可用规则集列表
https://cs.symfony.com/doc/ruleSets/index.html
### 可用规则列表
https://cs.symfony.com/doc/rules/index.html

## phpstrom配置

### 打开配置页  
File>>Settings>>Tools>>External Tools

![alt](/assets/images/posts/2023-06-11-phpcsfixer3/config.png)

> 配置说明

Program
```conf
C:\Users\用户\AppData\Roaming\Composer\vendor\bin\php-cs-fixer.bat
```
Arguments

```conf
# 使用本项目下配置文件
fix $FileDir$/$FileName$ --config=$ProjectFileDir$/.php-cs-fixer.php

# 使用全局配置文件
fix $FileDir$/$FileName$ --config=C:\Users\用户\AppData\Roaming\Composer\vendor\bin\.php-cs-fixer.php
```

Working directory  
```conf
$ProjectFileDir$
```

### 快捷键设置  

File>>Settings>>Keymap>>External Tools

![alt](/assets/images/posts/2023-06-11-phpcsfixer3/kepmap.png)