<?php
// forms/config.php
declare(strict_types=1);

/**
 * Chargement automatique du fichier .env :
 * Priorité : .env.local > .env.prod > .env
 * - Retire le BOM UTF-8
 * - Tolère les guillemets autour des valeurs
 * - Parse les commentaires commençant par # ou ;
 */

function config_env_path(): string {
  $base = dirname(__DIR__);
  $envFile = $base . '/.env';
  if (is_file($base . '/.env.prod'))  $envFile = $base . '/.env.prod';
  if (is_file($base . '/.env.local')) $envFile = $base . '/.env.local';
  return $envFile;
}

static $ENV_VARS = null;

if ($ENV_VARS === null) {
  $ENV_VARS = [];
  $path = config_env_path();
  if (is_file($path)) {
    $raw = file_get_contents($path) ?: '';

    // Enlève le BOM UTF-8
    $raw = preg_replace('/^\xEF\xBB\xBF/', '', $raw);

    // Supprime les commentaires (# ou ;) et les lignes vides
    $lines = [];
    foreach (explode("\n", str_replace("\r\n", "\n", $raw)) as $line) {
      $trim = trim($line);
      if ($trim === '' || $trim[0] === '#' || $trim[0] === ';') continue;
      $lines[] = $trim;
    }
    $clean = implode("\n", $lines);

    // Parse
    $vars = parse_ini_string($clean, false, INI_SCANNER_TYPED);

    if (is_array($vars)) {
      foreach ($vars as $k => $v) {
        if (is_string($v)) {
          $v = trim($v);
          // Retire les guillemets si présents
          if ((str_starts_with($v, '"') && str_ends_with($v, '"')) ||
              (str_starts_with($v, "'") && str_ends_with($v, "'"))) {
            $v = substr($v, 1, -1);
          }
          $vars[$k] = $v;
        }
      }
      $ENV_VARS = $vars;
    }
  }
}

/**
 * Récupère une variable d'environnement
 */
function env(string $key, $default = null) {
  $v = getenv($key);
  if ($v !== false) return $v;
  global $ENV_VARS;
  return array_key_exists($key, $ENV_VARS) ? $ENV_VARS[$key] : $default;
}
