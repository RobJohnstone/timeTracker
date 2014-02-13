import jinja2
import webapp2
import os
import logging
from webapp2_extras import sessions

JINJA_ENVIRONMENT = jinja2.Environment(
    loader=jinja2.FileSystemLoader(os.path.dirname(__file__)),
    extensions=['jinja2.ext.autoescape'],
    autoescape=True)

# repeated code - learn how to use python modules and create one!
class BaseHandler(webapp2.RequestHandler):
	def dispatch(self):
		self.session_store = sessions.get_store(request=self.request)

		try:
			webapp2.RequestHandler.dispatch(self)
		finally:
			self.session_store.save_sessions(self.response)

	@webapp2.cached_property
	def session(self):
		return self.session_store.get_session()

config = {
  'webapp2_extras.sessions': {
    'secret_key': 'P4FFjAoL5vQ4RTC7nDGUuVq'
  }
}

# end repeated code

class TimeTracker(BaseHandler):

	def get(self):

		if self.session.get('user'):
			logging.info('logged in!')
			template = JINJA_ENVIRONMENT.get_template('index.html')
		else:
			logging.info('not logged in')
			template = JINJA_ENVIRONMENT.get_template('login.html')
		self.response.write(template.render())

application = webapp2.WSGIApplication([
	('/.*', TimeTracker)
], config=config, debug=True)