#include <linux/init.h>
#include <linux/module.h>
#include <linux/mm.h>
#include <linux/mmzone.h>
#include <linux/blkdev.h>
#include <linux/list.h>
#include <linux/swap.h>
#include <linux/cpumask.h>
#include <linux/kernel_stat.h>
#include <linux/proc_fs.h>
#include <linux/fs.h>
#include <linux/interrupt.h>
#include <linux/sched.h>
#include <linux/sched/stat.h>
#include <linux/seq_file.h>
#include <linux/slab.h>
#include <linux/time.h>
#include <linux/irqnr.h>
#include <linux/sched/cputime.h>
#include <linux/tick.h>

#include "cpu.h"

int escribir_archivo(struct seq_file *archivo, void *v)
{
	unsigned long cpu_bit = *((unsigned long *)cpu_possible_mask->bits);
	unsigned long idx = cpu_bit;
	
	unsigned long user   = 0;
	unsigned long nice   = 0;
	unsigned long sys    = 0;
	unsigned long idle   = 0;
	unsigned long iowait = 0;
	unsigned long hirq   = 0;
	unsigned long sirq   = 0;
	unsigned long steal  = 0;

	unsigned long total_cpu    = 0;
	unsigned long usage_cpu    = 0;

	int c = 0;
	while(idx)
	{
		user   += cpu_user_time(c);
		nice   += cpu_nice_time(c);
		sys    += cpu_sys_time(c);
		idle   += cpu_idle_time(c);
		iowait += cpu_iowait_time(c);
		hirq   += cpu_hirq_time(c);
		sirq   += cpu_sirq_time(c);
		steal  += cpu_steal_time(c);

		printk(KERN_ALERT "user: %lu\n", cpu_user_time(c));
		printk(KERN_ALERT "nice: %lu\n", cpu_nice_time(c));
		printk(KERN_ALERT "sys: %lu\n", cpu_sys_time(c));
		printk(KERN_ALERT "idle: %lu\n", cpu_idle_time(c));
		printk(KERN_ALERT "iowait: %lu\n", cpu_iowait_time(c));
		printk(KERN_ALERT "hi: %lu\n", cpu_hirq_time(c));
		printk(KERN_ALERT "si: %lu\n", cpu_sirq_time(c));
		printk(KERN_ALERT "st: %lu\n", cpu_steal_time(c));

		c++;
		idx = idx >> 1;
	}

	total_cpu = user+nice+sys+idle+iowait+hirq+sirq+steal;
 	usage_cpu = user+nice+sys+hirq+sirq+steal;

    seq_printf(archivo, "%li\n", usage_cpu * 10000 / total_cpu  );
	return 0;
}

int al_abrir(struct inode *inode, struct file *file){
    return single_open(file, escribir_archivo, NULL);
}

struct file_operations operaciones = {
    .open = al_abrir,
    .read = seq_read
};

int  iniciar(void) 
{
    struct proc_dir_entry *entry;
    
    entry = proc_create("cpu_201113915", 0, NULL, &operaciones);
    
    if(!entry) 
        return -1; 
    else 
        printk(KERN_INFO "Victor Alfonso López Morales\n");
        
    return 0;
}

void salir(void)
{
    remove_proc_entry("cpu_201113915", NULL);
    printk(KERN_INFO "Diciembre 2020\n");
}

module_init(iniciar);
module_exit(salir);

MODULE_LICENSE("GPL");
MODULE_DESCRIPTION("Modulo Utilización CPU");
MODULE_AUTHOR("201113915");