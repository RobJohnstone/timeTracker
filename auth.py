import json
import baseHandler
from user import User

class Auth(baseHandler.BaseHandler):

	def post(self):
		if self.session.get('user'):
			del self.session['user']
		data = json.loads(self.request.body)
		user = User.fetchUser(data.get('email'))
		if user:
			if user.verify(data['password']):
				self.session['user'] = user.email
				self.response.write('{"success":true}')
			else:
				self.response.write('{"success":false,"reason":"Sorry, we were unable to log you in because your password is incorrect"}')
		else:
			self.response.write('{"success":false,"reason":"Sorry, we do not recognise your email address"}')