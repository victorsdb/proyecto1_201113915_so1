obj-m += cpu_201113915.o
cpu_201113915-objs += main.o
cpu_201113915-objs += cpu.o

all:
	make -C /lib/modules/$(shell uname -r)/build M=$(PWD) modules
clean:
	make -C /lib/modules/$(shell uname -r)/build M=$(PWD) clean