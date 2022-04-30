declare type Methods<T> = {[M in keyof T]: T[M] extends (...a: any) => any ? M : never}[keyof T]
