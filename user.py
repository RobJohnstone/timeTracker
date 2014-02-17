import datetime

from google.appengine.ext import ndb
from webapp2_extras import security

passwordPepper = 'tlOtI7S8DZ7giwiNETBadf8'

class User(ndb.Model):
	email = ndb.StringProperty(indexed=True)
	hashedPassword = ndb.StringProperty(indexed=False)
	passwordSalt = ndb.StringProperty(indexed=False)
	creationDate = ndb.DateTimeProperty(indexed=False)
	currentUser = None

	def verify(self, password):
		hashedPassword = security.hash_password(password, 'sha1', self.passwordSalt, passwordPepper)
		return security.compare_hashes(hashedPassword, self.hashedPassword)

	@classmethod
	def create(cls, email, password):
		conflicts = User.fetchUser(email)
		if conflicts:
			return False
		newUser = User()
		newUser.email = email
		newUser.passwordSalt = security.generate_random_string(entropy=64)
		newUser.hashedPassword = security.hash_password(password, 'sha1', newUser.passwordSalt, passwordPepper)
		newUser.creationDate = datetime.datetime.now()
		return newUser.put()

	@classmethod
	def fetchUser(cls, email):
		user = User.query().filter(User.email == email).fetch()
		if len(user) == 0:
			return False
		return user[0];

	@classmethod
	def setCurrentUser(cls, email):
		cls.currentUser = User.fetchUser(email)
		return cls.currentUser

	@classmethod
	def getCurrentUser(cls):
		return cls.currentUser

	@classmethod
	def getCurrentUserKey(cls):
		if cls.currentUser:
			return cls.currentUser.key
		else:
			return False