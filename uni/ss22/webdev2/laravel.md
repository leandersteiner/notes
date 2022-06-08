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

## Authentication

### Middleware

`php artisan make:middleware MyMiddleware`

```php
class MyMiddleware implements Middleware {
    // Filter for incoming requests
    public function handle(Request $request, Closure $next) {
        return $next($request);
    }

    // Filter for outgoing requests
    public function handle(Request $request, Closure $next) {
        $response = $next($request);
        return $response;
    }
}
```

### Provider

- Passport: OAuth2
- Sanctum: **API-Token** & session-based implementation for SPAs

### Sanctum

- `composer require laravel/sanctum`
- `php artisan vendor:publish --provider="Laravel/Sanctum/SanctumServiceProvider"`
- Make sure to migrate after
- Configuration in `config/sanctum.php`
  - e.g. how long tokens are valid

- New routes will be needed
- `/register` for creating user
- `/login` for authenticating users
- In both cases a token will be returned as the answer
- New `AuthController` - `php artisan make:controller AuthController`