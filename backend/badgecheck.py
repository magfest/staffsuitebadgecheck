#!/bin/env python3
import settings, logging, argparse
from uuid	import UUID
from os		import path, chdir

def parseargs():
	parser = argparse.ArgumentParser()
	parser.add_argument('-V', '--version', action='version',
		version="%(prog)s v{}".format(settings.version))
	parser.add_argument('--debug', action='store_true',
		help='Run with debug settings')
	parser.add_argument('-v', '--verbose', action='store_true',
		help='Output more verbose info')
	return parser.parse_args()

def startup():
	chdir(path.dirname(path.abspath(__file__)))
	open(settings.logfile, 'w').close()

	# Set up logging
	logger = logging.getLogger(__name__);
	logger.setLevel(logging.DEBUG)
	ch = logging.StreamHandler()
	# Set loglevel and format
	ch.setLevel(logging.WARN)
	if args.verbose:	ch.setLevel(logging.INFO)
	if args.debug:		ch.setLevel(logging.DEBUG)
	ch.setFormatter(logging.Formatter("[%(levelname)8s] %(name)s: %(message)s"))
	logger.addHandler(ch)
	fh = logging.FileHandler(settings.logfile)
	# Set loglevel and format
	fh.setLevel(logging.INFO); fh.setFormatter(logging.Formatter(
		"%(asctime)s [%(levelname)8s] %(name)s: %(message)s",
		"%Y-%m-%d %H:%M:%S"))
	logger.addHandler(fh)
	logger.debug('Logging set up.')
	logger.info("Badge check midlayer v{}".format(settings.version))

	# Set up API key
	try:
		with open('apikey.txt') as f:
			settings.magapi.headers['X-Auth-Token'] = str(UUID(f.read().strip()))
	except FileNotFoundError:
		logger.fatal('Could not find API key file, refusing to run.')
		raise SystemExit
	except ValueError:
		logger.fatal('API key not a valid UUID, refusing to run.')
		raise SystemExit

if __name__ == '__main__':
	args =parseargs()
	startup()
