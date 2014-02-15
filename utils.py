import datetime

def py_from_api_date(apiDate):
	dateList = map(int, apiDate.split('-'))
	return datetime.date(*dateList)

def api_from_py_date(pyDate):
	date = [str(pyDate.year),
			'%02d' % pyDate.month,
			'%02d' % pyDate.day]
	return '-'.join(date)