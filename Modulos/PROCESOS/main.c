#include <linux/proc_fs.h>
#include <linux/seq_file.h>
#include <linux/kernel.h>
#include <linux/module.h>
#include <linux/init.h>
#include <linux/sched/signal.h>
#include <linux/sched.h>
#include <linux/fs.h>

int procesosEjecucion   = 0;
int procesosSuspendidos = 0;
int proccesosDetenidos  = 0;
int procesosZombie      = 0;
int totalProcesos       = 0;

struct task_struct *task;
struct task_struct *task_child;
struct list_head *list;

void getEstado(long estado){
    totalProcesos = totalProcesos+1;
    switch (estado)
    {
        case 1: //ejecucion
            procesosEjecucion = procesosEjecucion+1;
            break;
        case 0: //pendiente
            procesosSuspendidos = procesosSuspendidos+1;
            break;
        case 260: //Tl
            proccesosDetenidos = proccesosDetenidos+1;
            break;
        case 128: //zombies
            procesosZombie = procesosZombie+1;
            break;    
    }
}

static int escribir_archivo(struct seq_file *archivo, void *v){

    seq_printf(archivo, "%d\n", procesosEjecucion);
    seq_printf(archivo, "%d\n", procesosSuspendidos);
    seq_printf(archivo, "%d\n", proccesosDetenidos);
    seq_printf(archivo, "%d\n", procesosZombie);
    seq_printf(archivo, "%d\n", totalProcesos);


    for_each_process(task){
        seq_printf(archivo, "PADRE,%d,%s,%ld$", task->pid, task->comm, task->state);
        getEstado(task->state);

        list_for_each(list, &task->children){
            task_child = list_entry(list, struct task_struct, sibling);

            seq_printf(archivo, "HIJO,%d,%s,%ld$", task_child->pid, task_child->comm, task_child->state);
            getEstado(task_child->state);
        }
    }

    seq_printf(archivo, "\n");
    return 0;
}

static int al_abrir(struct inode *inode, struct file *file){
    return single_open(file, escribir_archivo, NULL);
}

static struct file_operations operaciones = 
{
    .open = al_abrir,
    .read = seq_read
};

int iniciar(void){
    struct proc_dir_entry *entry;
    
    entry = proc_create("procesos_201113915", 0, NULL, &operaciones);

    if(!entry) 
        return -1; 
    else 
        printk(KERN_INFO "Victor Alfonso López Morales\n");

    return 0;
}

void salir(void)
{
    remove_proc_entry("procesos_201113915", NULL);
    printk(KERN_INFO "Diciembre 2020\n");
}

module_init(iniciar);
module_exit(salir);

MODULE_LICENSE("GPL");
MODULE_DESCRIPTION("Modulo de lista de procesos");
MODULE_AUTHOR("201113915");