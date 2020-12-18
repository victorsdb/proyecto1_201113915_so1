obj-m += cpu_201113915.o
all:
	make -C /lib/modules/$(shell uname -r)/build M=$(PWD)
clean:
	make -C /lib/modules/$(shell uname -r)/build M=$(PWD) clean