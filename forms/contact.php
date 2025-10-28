<?php
declare(strict_types=1);

require __DIR__ . '/config.php';
require __DIR__ . '/../vendor/autoload.php'; // PHPMailer via Composer

use PHPMailer\PHPMailer\PHPMailer;
use PHPMailer\PHPMailer\Exception as MailerException;

$APP_ENV       = env('APP_ENV', 'dev');
$MAIL_TO       = env('MAIL_TO', 'contact@exemple.com');
$MAIL_FROM     = env('MAIL_FROM', 'no-reply@exemple.com');

$SMTP_HOST     = env('SMTP_HOST', 'sandbox.smtp.mailtrap.io');
$SMTP_PORT     = (int)env('SMTP_PORT', '2525');
$SMTP_USER     = env('SMTP_USER', '');
$SMTP_PASS     = env('SMTP_PASS', '');
$SMTP_SECURE   = env('SMTP_SECURE', 'tls'); // 'tls' (recommandé sur 2525/587)

$SIMULATE_MAIL = (string)env('SIMULATE_MAIL', '0') === '1';

function json_response(array $payload, int $code = 200): void {
  http_response_code($code);
  header('Content-Type: application/json; charset=utf-8');
  echo json_encode($payload, JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES);
  exit;
}

if (($_SERVER['REQUEST_METHOD'] ?? 'GET') !== 'POST') {
  json_response(['ok' => false, 'error' => 'Méthode non autorisée'], 405);
}

/* Honeypot */
if (!empty($_POST['website'] ?? '')) {
  json_response(['ok' => true, 'message' => 'Message accepté.']);
}

/* Champs */
$name    = trim((string)($_POST['name'] ?? ''));
$email   = trim((string)($_POST['email'] ?? ''));
$subject = trim((string)($_POST['subject'] ?? ''));
$message = trim((string)($_POST['message'] ?? ''));

/* Validation (UX-friendly) */
$errors = [];
if ($name === '' || mb_strlen($name) < 2)         $errors['name'] = "2 caractères minimum.";
if (!filter_var($email, FILTER_VALIDATE_EMAIL))    $errors['email'] = "Adresse e-mail invalide.";
if ($subject === '' || mb_strlen($subject) < 3)    $errors['subject'] = "3 caractères minimum.";
if ($message === '' || mb_strlen($message) < 10)   $errors['message'] = "10 caractères minimum.";

if ($errors) {
  json_response([
    'ok'     => false,
    'error'  => 'Merci de corriger les champs indiqués.',
    'fields' => $errors
  ], 200);
}

/* Simulation */
if ($SIMULATE_MAIL) {
  json_response(['ok' => true, 'message' => 'Simulation activée — aucun e-mail réel envoyé.']);
}

/* Sécuriser le sujet */
$subjectClean = preg_replace('/[\r\n]+/', ' ', $subject);
$subjectLine  = '[Contact] ' . $subjectClean;

/* Construire HTML/TXT */
$text = "Nom : {$name}\nE-mail : {$email}\nSujet : {$subject}\n\nMessage :\n{$message}\n";
$html = '<p><strong>Nom :</strong> '.htmlspecialchars($name).'</p>'
      . '<p><strong>E-mail :</strong> '.htmlspecialchars($email).'</p>'
      . '<p><strong>Sujet :</strong> '.htmlspecialchars($subject).'</p>'
      . '<p><strong>Message :</strong><br>'.nl2br(htmlspecialchars($message)).'</p>';

/* Vérifs config */
if ($MAIL_FROM === '' || $MAIL_TO === '') {
  json_response(['ok' => false, 'error' => 'MAIL_FROM ou MAIL_TO manquant dans .env'], 200);
}
if ($SMTP_USER === '' || $SMTP_PASS === '') {
  json_response(['ok' => false, 'error' => 'Identifiants SMTP Mailtrap manquants (.env)'], 200);
}

/* Envoi via PHPMailer */
$mail = new PHPMailer(true);
try {
  $mail->isSMTP();
  $mail->Host       = $SMTP_HOST;
  $mail->SMTPAuth   = true;
  $mail->Port       = $SMTP_PORT;
  $mail->Username   = $SMTP_USER;
  $mail->Password   = $SMTP_PASS;

  // Sécurité (TLS/STARTTLS)
  // PHPMailer accepte 'tls' comme STARTTLS
  if ($SMTP_SECURE) {
    $mail->SMTPSecure = PHPMailer::ENCRYPTION_STARTTLS;
  }

  $mail->CharSet = 'UTF-8';
  $mail->setFrom($MAIL_FROM, 'Formulaire CV');
  $mail->addAddress($MAIL_TO);
  $mail->addReplyTo($email, $name);

  $mail->Subject = $subjectLine;
  $mail->Body    = $html;
  $mail->AltBody = $text;
  $mail->isHTML(true);

  // Envoi
  $mail->send();

  json_response(['ok' => true, 'message' => 'Votre message a bien été envoyé. Merci !']);

} catch (MailerException $e) {
  $detail = ($APP_ENV !== 'prod') ? ' Détail: '.$e->getMessage() : '';
  json_response(['ok' => false, 'error' => "Envoi refusé par le SMTP Mailtrap.".$detail], 200);
}
