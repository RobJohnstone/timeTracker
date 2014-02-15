from google.appengine.ext import ndb

import utils

class Task(ndb.Model):
	date = ndb.DateProperty(indexed=True)
	task = ndb.StringProperty(indexed=False)

	def simplify(self):
		return {'id':self.key.id(), 'date': utils.api_from_py_date(self.date), 'task': self.task}

	def update(self, data):
		self.task = data['task']
		self.put()

	@classmethod
	def fetchTasks(cls, startDate, endDate, maxResults=100):
		tasks = Task.query().filter(Task.date >= startDate).filter(Task.date < endDate).fetch(maxResults)
		tasksDict = {}
		for task in tasks:
			taskDate = utils.api_from_py_date(task.date)
			if taskDate in tasksDict:
				tasksDict[taskDate].append(task.simplify())
			else:
				tasksDict[taskDate] = [task.simplify()]
		return tasksDict

	@classmethod
	def create(cls, data):
		newTask = Task()
		newTask.date = utils.py_from_api_date(data['date'])
		newTask.task = data['task']
		return newTask.put() # TODO: give tasks an ancestor based on the user

	@classmethod
	def delete(cls, id):
		key = ndb.Key('Task', int(id))
		key.delete()