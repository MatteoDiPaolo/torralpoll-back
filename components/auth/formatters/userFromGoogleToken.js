

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
	rol: config.adminsEmails.includes(payloadFromGoogle.email) ? config.adminRol : config.userRol,
});


module.exports = {
	formatUserFromGoogleToken,
};
