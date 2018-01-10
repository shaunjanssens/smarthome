#!/usr/bin/env python2.7

import argparse
parser = argparse.ArgumentParser(description='Sends a decimal code to a 433Mhz receiver')
parser.add_argument('code', metavar='CODE', type=int, help="Decimal code to send")
args = parser.parse_args()

print "Send code: " + str(args.code)
