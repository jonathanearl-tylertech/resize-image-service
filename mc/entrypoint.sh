#! /bin/sh
sleep 3;
# set alias for remote commands
mc alias set myminio http://minio:9000 minioadmin minioadmin
# alias/bucketname
mc mb myminio/dev-bucket
mc policy set public myminio/dev-bucket
exit 0;
