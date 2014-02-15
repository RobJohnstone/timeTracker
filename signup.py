import json
import baseHandler
from user import User

class Signup(baseHandler.BaseHandler):

	def post(self):
		data = json.loads(self.request.body)
		key = User.create(data['email'], data['password'])
		if key == False:
			self.response.write('{"success":false,"reason":"Sorry, this email already exists did you mean to log in?"}')
		else:
			self.session['user'] = data['email']
			self.response.write('{"success":true}')