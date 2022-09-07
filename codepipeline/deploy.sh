aws cloudformation deploy --template-file template.yaml \
    --stack-name imotostorepipeline \
    --parameter-overrides \
        CommunityName=imoto \
        AcmCertificateArn=arn:aws:acm:us-east-1:520460079949:certificate/25b76b80-9a2d-48a7-8a84-74c9833a31fd\
    --tags community=imoto \
    --capabilities CAPABILITY_NAMED_IAM \
    --profile default --region us-east-1