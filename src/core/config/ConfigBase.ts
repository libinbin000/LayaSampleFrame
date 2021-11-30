export abstract class ConfigBase{
    public abstract configName();
    public abstract parse(data:any):any;
}