import webapp2
import json
import datetime

from google.appengine.ext import ndb

def py_from_api_date(apiDate):
	dateList = map(int, apiDate.split('-'))
	return datetime.date(*dateList)

def api_from_py_date(pyDate):
	date = [str(pyDate.year),
			'%02d' % pyDate.month,
			'%02d' % pyDate.day]
	return '-'.join(date)

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

class Tasks(webapp2.RequestHandler):

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

application = webapp2.WSGIApplication([
	('/api/tasks/.*', Tasks)
], debug=True)