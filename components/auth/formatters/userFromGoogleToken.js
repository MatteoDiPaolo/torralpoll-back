

const getRole = (email, config) => {
	if (config.adminsEmails.includes(email)) {
		return config.adminRol;
	} else if (config.usersEmails.includes(email)) {
		return config.userRol;
	}
	return 'NO ROLE';
};


const formatUserFromGoogleToken = (payloadFromGoogle, config) => ({
	iss: payloadFromGoogle.iss,
	hd: payloadFromGoogle.hd,
	email: payloadFromGoogle.email,
	email_verified: payloadFromGoogle.email_verified,
	name: payloadFromGoogle.name,
	picture: payloadFromGoogle.picture,
	given_name: payloadFromGoogle.given_name,
	family_name: payloadFromGoogle.family_name,
	locale: payloadFromGoogle.locale,
	iat: payloadFromGoogle.iat,
	exp: payloadFromGoogle.exp,
	typ: payloadFromGoogle.typ,
	rol: getRole(payloadFromGoogle.email, config),
});


module.exports = {
	formatUserFromGoogleToken,
};
