# Manual procesos de instalación de modulos

Para la instalación de cada modulo unicamente es necesario correr el siguiente comando dentro de las carpetas Modulos/RAM y Modulos/CPU y el mismo se encargara de instalarlos
```
    sudo sh install.sh
```
## Contenido del install.sh
Dentro del archivo se utilizaron los siguientes comando que luego seran explicados:
```s
make all
rmmod cpu_201113915
insmod cpu_201113915.ko
```
 ## Makefile
Se utilizó el siguiente código en un archivo Makefile:

```Makefile
obj-m += cpu_201113915.o
cpu_201113915-objs += main.o
cpu_201113915-objs += cpu.o

all:
    make -C /lib/modules/$(shell uname -r)/build M=$(PWD) modules
clean:
    make -C /lib/modules/$(shell uname -r)/build M=$(PWD) clean
```

luego de esto se corrio el comando **make all** para la creación de los ejecutables, y el comando **make clean** para borrarlos.

 ## Instalación Modulos
Se utilizo el siguiente comando para cargar los modulos al kernel:

```s
sudo insmod <<nombre_modulo>>.ko
```

 ## Desinstalación de Modulos
Se utilizo el siguiente comando para eliminar los modulos al kernel:
```s
sudo rmmod <<nombre_modulo>>.ko
```
 ## Ver el buffer
 Este comando se utilizo para visualizar el buffer:
Se utilizo el siguiente comando para eliminar los modulos al kernel:
```s
Dmesg
```
 ## Vaciar los mensajes del buffer
 Este comando se utilizo para visualizar el buffer:
Se utilizo el siguiente comando para eliminar los modulos al kernel:
```s
Dmesg -c
```

