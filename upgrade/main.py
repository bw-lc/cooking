#!c:/Python27/python.exe
# coding=utf-8
####################################################################################################################################
import sys, os, binascii

#number = ord(char)
#char = chr(number)

####################################################################################################################################
def main():
    fpr = open('app.bin', 'rb')
    fpw = open('firmware.js', 'wb')
    
    fpw.write('var gcb_cmds = [\r\n\">bp 2,6;\",\r\n">be 2,6;\",\r\n">bi 2,6;\",\r\n')
    
    ram_addr = 0
    rom_addr = 0x00002000
    sec_addr = 2
    while True:
        ds = fpr.read(16)
        if not ds:
            break
        sum_0 = 0
        for d in ds:
            sum_0 = sum_0 + ord(d)
        
        cs = '\">bw %02x,%s,%x;\",' % (ram_addr, binascii.hexlify(ds), sum_0)
        print cs
        fpw.write(cs)
        fpw.write('\r\n')
        ram_addr = ram_addr + 16
        if ram_addr >= 256:
            fpw.write('\">bp %x,%x;\",\r\n' % (sec_addr, sec_addr))
            fpw.write('\">bc %x,00,100;\",\r\n' % (rom_addr))
            ram_addr = 0
            rom_addr = rom_addr + 256
            if (rom_addr % 0x1000) == 0:
                sec_addr = sec_addr + 1

    fpw.write('\">bp %x,%x;\",\r\n' % (sec_addr, sec_addr))
    fpw.write('\">bc %x,00,100;\",\r\n' % (rom_addr))
    fpw.write('\">bg;\"\r\n];\r\n')
    fpw.close()
    fpr.close()
    
    
    


####################################################################################################################################
if __name__ == '__main__':
  main()

####################################################################################################################################
