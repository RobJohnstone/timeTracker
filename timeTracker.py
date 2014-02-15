import jinja2
import webapp2
import os

import config
from baseHandler import BaseHandler

JINJA_ENVIRONMENT = jinja2.Environment(
    loader=jinja2.FileSystemLoader(os.path.dirname(__file__)),
    extensions=['jinja2.ext.autoescape'],
    autoescape=True)

class TimeTracker(BaseHandler):

	def get(self):

		if self.session.get('user'):
			template = JINJA_ENVIRONMENT.get_template('index.html')
		else:
			template = JINJA_ENVIRONMENT.get_template('login.html')
		self.response.write(template.render())

application = webapp2.WSGIApplication([
	('/.*', TimeTracker)
], config=config.config, debug=True)