import webapp2

import config
import Tasks
import Auth	
import Signup
import Logout

application = webapp2.WSGIApplication([
	('/api/tasks/.*', tasks.Tasks),
	('/api/auth/.*', auth.Auth),
	('/api/logout/', logout.Logout),
	('/api/signup/.*', signup.Signup)
], config=config.config, debug=True)