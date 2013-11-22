<?php
if($_SERVER['REQUEST_METHOD'] === 'POST')
{
	$required = array(
		'product' => 'Kies een product',
		'company' => 'Je bedrijfsnaam is nodig voor de factuur',
		'email' => 'Je e-mailadres is nodig om contact met je te hebben',
		'kvk' => 'Je KvK nummer hebben we nodig om je document te kunnen schrijven',
		'btw' => 'Je BTW nummer is verplicht op je documenten, dus moeten we hebben',
	);

	$error = array();
	foreach($required as $field => $message)
	{
		if(!isset($_POST[$field]) || empty($_POST[$field]))
		{
			$error[$field] = $message;
		}
	}

	if(isset($error) && !empty($error))
	{
		echo json_encode(array('missing_fields' => $error));

		header('HTTP/1.0 400 Bad Request');
		exit;
	}

$content = 'Waarde lezer,' . "\n\n" . 
			'Nieuwe bestelling met onderstaande data:' . "\n" .
			'Product: ' . $_POST['product'] . "\n" . 
			'Bedrijfsnaam: ' . $_POST['company'] . "\n" . 
			'Contactpersoon: ' . $_POST['name'] . "\n" . 
			'Adres: ' . $_POST['address'] . "\n" . 
			'Postcode: ' . $_POST['postal'] . "\n" . 
			'Plaats: ' . $_POST['city'] . "\n" . 
			'E-mailadres: ' . $_POST['email'] . "\n" . 
			'Telefoonnummer: ' . $_POST['phone'] . "\n" . 
			'KvK: ' . $_POST['kvk'] . "\n" . 
			'BTW: ' . $_POST['btw'] . "\n\n" .
			'-------'. "\n" .
			'Waardevolle groeten,'. "\n" .
			'Het Systeem.'. "\n";

	$headers = 'From: Juridisch Geregeld Bestelsysteem <nieuwe-bestelling@juridischgeregeld.nl>';
	mail('contact@juridischgeregeld.nl', 'Bestelling!', $content, $headers);

	echo json_encode(array('status' => 'ok'));
	header('HTTP/1.0 200 OK');
}