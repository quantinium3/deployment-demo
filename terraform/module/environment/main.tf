module "network" {
  source = "../network"

  availability_zones = ["ap-south-1a", "ap-south-1b", "ap-south-1c"]
  bastion_ingress = var.bastion_ingress
  cidr = "10.0.0.0/16"
  name = var.name
}
