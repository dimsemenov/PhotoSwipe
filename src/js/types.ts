export type Methods<T> = {[M in keyof T]: T[M] extends (...a: any) => any ? M : never}[keyof T]

export type AddPostfix<T extends string, P extends string> = `${T}${P}`

export interface Type<T> extends Function {
  new(...args: any[]): T;
}
