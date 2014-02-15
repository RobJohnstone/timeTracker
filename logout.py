import baseHandler

class Logout(baseHandler.BaseHandler):

	def post(self):
		if self.session.get('user'):
			del self.session['user']