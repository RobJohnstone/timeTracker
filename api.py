import webapp2

import config
import tasks
import auth	
import signup
import logout

application = webapp2.WSGIApplication([
	('/api/tasks/.*', tasks.Tasks),
	('/api/auth/.*', auth.Auth),
	('/api/logout/', logout.Logout),
	('/api/signup/.*', signup.Signup)
], config=config.config, debug=True)