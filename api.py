import webapp2
import json
import datetime
import logging

from google.appengine.ext import ndb
from webapp2_extras import sessions
from webapp2_extras import security

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

passwordPepper = 'tlOtI7S8DZ7giwiNETBadf8'

# end repeated code

def py_from_api_date(apiDate):
	dateList = map(int, apiDate.split('-'))
	return datetime.date(*dateList)

def api_from_py_date(pyDate):
	date = [str(pyDate.year),
			'%02d' % pyDate.month,
			'%02d' % pyDate.day]
	return '-'.join(date)

class User(ndb.Model):
	email = ndb.StringProperty(indexed=True)
	hashedPassword = ndb.StringProperty(indexed=False)
	passwordSalt = ndb.StringProperty(indexed=False)
	creationDate = ndb.DateTimeProperty(indexed=False)

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

class Task(ndb.Model):
	date = ndb.DateProperty(indexed=True)
	task = ndb.StringProperty(indexed=False)

	def simplify(self):
		return {'id':self.key.id(), 'date': api_from_py_date(self.date), 'task': self.task}

	def update(self, data):
		self.task = data['task']
		self.put()

	@classmethod
	def fetchTasks(cls, startDate, endDate, maxResults=100):
		tasks = Task.query().filter(Task.date >= startDate).filter(Task.date < endDate).fetch(maxResults)
		tasksDict = {}
		for task in tasks:
			taskDate = api_from_py_date(task.date)
			if taskDate in tasksDict:
				tasksDict[taskDate].append(task.simplify())
			else:
				tasksDict[taskDate] = [task.simplify()]
		return tasksDict

	@classmethod
	def create(cls, data):
		newTask = Task()
		newTask.date = py_from_api_date(data['date'])
		newTask.task = data['task']
		return newTask.put() # TODO: give tasks an ancestor based on the user

	@classmethod
	def delete(cls, id):
		key = ndb.Key('Task', int(id))
		key.delete()

class Tasks(BaseHandler):

	def get(self):
		self.response.headers['Content-Type'] = 'application/json'
		params = self.request.path.split('/')[2:]
		date = map(int, params[1].split('-'))
		if len(date) == 3:
			startDate = datetime.date(*date)
			endDate = startDate + datetime.timedelta(days=1)
		elif len(date) == 2:
			if date[1] < 12:
				startDate = datetime.date(date[0], date[1], 1)
				endDate = datetime.date(date[0], date[1] + 1, 1)
			else:
				startDate = datetime.date(date[0], 12, 1)
				endDate = datetime.date(date[0] + 1, 1, 1)
		tasksDict = Task.fetchTasks(startDate, endDate, 1000)

		self.response.write(json.dumps(tasksDict))

	def post(self):
		data = json.loads(self.request.body)
		if 'id' in data:
			task = Task.get_by_id(data['id'])
			task.update(data)
			self.response.write(str(data['id']))

		else:
			key = Task.create(data)
			self.response.write(str(key.id()))

	def delete(self):
		id = self.request.path.split('/')[3]
		Task.delete(id)

class Auth(BaseHandler):

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

class Signup(BaseHandler):

	def post(self):
		data = json.loads(self.request.body)
		key = User.create(data['email'], data['password'])
		if key == False:
			self.response.write('{"success":false,"reason":"Sorry, this email already exists did you mean to log in?"}')
		else:
			self.session['user'] = data['email']
			self.response.write('{"success":true}')

class Logout(BaseHandler):

	def post(self):
		if self.session.get('user'):
			del self.session['user']

application = webapp2.WSGIApplication([
	('/api/tasks/.*', Tasks),
	('/api/auth/.*', Auth),
	('/api/logout/', Logout),
	('/api/signup/.*', Signup)
], config=config, debug=True)