# Laravel

## Routing

- in the routes folder (`web.php`/`api.php`)

```php
Route::get('/', function () {
    return "Hello";
});

Route::view('/view', 'welcome');

Route::redirect('/here', '/there');
```

## Eloquent

### Migrations

### 1:1

### 1:N

### N:M
