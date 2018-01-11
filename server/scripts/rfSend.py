#!/usr/bin/env python3

import argparse

from rpi_rf import RFDevice

parser = argparse.ArgumentParser(description='Sends a decimal code to a 433Mhz receiver')
parser.add_argument('code', metavar='CODE', type=int, help="Decimal code to send")
args = parser.parse_args()

rfdevice = RFDevice(17)
rfdevice.enable_tx()
rfdevice.tx_code(args.code)
rfdevice.cleanup()
