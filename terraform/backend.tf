terraform {
  backend "s3" {
    bucket = "deployment-demo-terraform-253260001114-ap-south-1-an"
    key = "terraform.tfstate"
    region = "ap-south-1"
  }
}
