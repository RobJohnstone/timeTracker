import json
import datetime
import baseHandler
from task import Task
from user import User

class Tasks(baseHandler.BaseHandler):

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
		tasksDict = Task.fetchTasks(startDate, endDate, User.getCurrentUserKey(), 1000)

		self.response.write(json.dumps(tasksDict))

	def post(self):
		data = json.loads(self.request.body)
		if 'id' in data:
			task = Task.get_by_id(data['id'])
			task.update(data)
			self.response.write(str(data['id']))

		else:
			key = Task.create(data, User.getCurrentUserKey())
			self.response.write(str(key.id()))

	def delete(self):
		id = self.request.path.split('/')[3]
		Task.delete(id)